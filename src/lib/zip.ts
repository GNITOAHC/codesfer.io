// Minimal ZIP writer for browser uploads. Produces the same kind of archive as
// the CLI's client.CompressFiles (deflate entries, UTF-8 names) so that
// `codesfer pull` and the /download route can extract web uploads.
// ZIP32 only: fine while the server caps uploads at 500 MB.

export interface ZipEntry {
	name: string;
	data: Blob;
	lastModified?: number;
}

const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		table[n] = c;
	}
	return table;
})();

async function crc32(blob: Blob): Promise<number> {
	let crc = 0xffffffff;
	const reader = blob.stream().getReader();
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		for (let i = 0; i < value.length; i++) {
			crc = CRC_TABLE[(crc ^ value[i]) & 0xff] ^ (crc >>> 8);
		}
	}
	return (crc ^ 0xffffffff) >>> 0;
}

async function deflateRaw(blob: Blob): Promise<Uint8Array<ArrayBuffer>> {
	const stream = blob.stream().pipeThrough(new CompressionStream('deflate-raw'));
	return new Uint8Array(await new Response(stream).arrayBuffer());
}

function dosDateTime(d: Date): { time: number; date: number } {
	return {
		time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
		date: ((Math.max(d.getFullYear() - 1980, 0) & 0x7f) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
	};
}

export async function createZip(entries: ZipEntry[]): Promise<Blob> {
	const encoder = new TextEncoder();
	const parts: BlobPart[] = [];
	const central: BlobPart[] = [];
	let offset = 0;

	for (const entry of entries) {
		const name = encoder.encode(entry.name);
		const crc = await crc32(entry.data);
		const compressed = await deflateRaw(entry.data);
		const { time, date } = dosDateTime(new Date(entry.lastModified ?? Date.now()));

		const local = new DataView(new ArrayBuffer(30));
		local.setUint32(0, 0x04034b50, true); // local file header signature
		local.setUint16(4, 20, true); // version needed to extract
		local.setUint16(6, 0x0800, true); // flags: UTF-8 names
		local.setUint16(8, 8, true); // method: deflate
		local.setUint16(10, time, true);
		local.setUint16(12, date, true);
		local.setUint32(14, crc, true);
		local.setUint32(18, compressed.byteLength, true);
		local.setUint32(22, entry.data.size, true);
		local.setUint16(26, name.byteLength, true);
		local.setUint16(28, 0, true); // extra field length

		const header = new DataView(new ArrayBuffer(46));
		header.setUint32(0, 0x02014b50, true); // central directory header signature
		header.setUint16(4, 20, true); // version made by
		header.setUint16(6, 20, true); // version needed to extract
		header.setUint16(8, 0x0800, true);
		header.setUint16(10, 8, true);
		header.setUint16(12, time, true);
		header.setUint16(14, date, true);
		header.setUint32(16, crc, true);
		header.setUint32(20, compressed.byteLength, true);
		header.setUint32(24, entry.data.size, true);
		header.setUint16(28, name.byteLength, true);
		// bytes 30-41 (extra/comment lengths, disk number, attributes) stay 0
		header.setUint32(42, offset, true); // local header offset

		parts.push(local.buffer, name, compressed);
		central.push(header.buffer, name);
		offset += 30 + name.byteLength + compressed.byteLength;
	}

	const centralBlob = new Blob(central);
	const eocd = new DataView(new ArrayBuffer(22));
	eocd.setUint32(0, 0x06054b50, true); // end of central directory signature
	eocd.setUint16(8, entries.length, true); // entries on this disk
	eocd.setUint16(10, entries.length, true); // total entries
	eocd.setUint32(12, centralBlob.size, true);
	eocd.setUint32(16, offset, true); // central directory offset

	return new Blob([...parts, centralBlob, eocd.buffer], { type: 'application/zip' });
}

import base from "base-x";

//export const ASCII_85 = `!"$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz`;
export const BASE_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const encoding = base(BASE_SET);

export const BASE = BASE_SET.length;

export function* permutations(length: number = 0): IterableIterator<string> {
  if (length === 0) {
    yield "";
    return;
  }

  for (let i = 0; i < BASE_SET.length; i++) {
    if (length > 1) {
      yield BASE_SET[i]!;
    }
    for (let permutation of permutations(length - 1)) {
      yield BASE_SET[i] + permutation;
    }
  }

  return "";
}

export function encode(data: Uint8Array): string {
  const buffer = new Uint8Array(new ArrayBuffer(data.byteLength));
  buffer.set(data);

  const a = buffer.at(buffer.byteLength - 1)!;
  const b = buffer.at(buffer.byteLength - 2)!;
  for (let i = 0; i < buffer.byteLength - 2; i++) {
    const byte = buffer[i]
    if (byte) {
      if (i % 2) {
        buffer[i] = (byte + a) % 256;
      } else {
        buffer[i] = (byte + b) % 256;
      }
    }
  }

  return encoding.encode(buffer);
}

export function decode(data: string): Uint8Array {
  const buffer = encoding.decode(data);

  const a = buffer.at(buffer.byteLength - 1)!;
  const b = buffer.at(buffer.byteLength - 2)!;
  for (let i = 0; i < buffer.byteLength - 2; i++) {
    const byte = buffer[i]
    if (byte) {
      if (i % 2) {
        buffer[i] = (byte - a + 256) % 256;
      } else {
        buffer[i] = (byte - b + 256) % 256;
      }
    }
  }

  return buffer;
}

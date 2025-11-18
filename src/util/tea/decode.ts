import { Decode, Decoder } from 'tea-cup-fp'

// Type-safe map10 for tea-cup-fp decoders
export function map10<A, B, C, D, E, F, G, H, I, J, R>(
  fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J) => R,
  da: Decoder<A>,
  db: Decoder<B>,
  dc: Decoder<C>,
  dd: Decoder<D>,
  de: Decoder<E>,
  df: Decoder<F>,
  dg: Decoder<G>,
  dh: Decoder<H>,
  di: Decoder<I>,
  dj: Decoder<J>,
): Decoder<R> {
  const first8: Decoder<{
    a: A
    b: B
    c: C
    d: D
    e: E
    f: F
    g: G
    h: H
  }> = Decode.map8(
    (a, b, c, d, e, f, g, h) => ({ a, b, c, d, e, f, g, h }),
    da,
    db,
    dc,
    dd,
    de,
    df,
    dg,
    dh,
  )

  const last2: Decoder<{ i: I; j: J }> = Decode.map2(
    (i, j) => ({ i, j }),
    di,
    dj,
  )

  return Decode.map2(
    (first, last) =>
      fn(
        first.a,
        first.b,
        first.c,
        first.d,
        first.e,
        first.f,
        first.g,
        first.h,
        last.i,
        last.j,
      ),
    first8,
    last2,
  )
}

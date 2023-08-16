import { ScaleName } from '../../utils/models';
import { CountScale, PairScale, AverageScale, SumScale, ShiftScale, SingleScale, SingleWeightedScale } from './factory';
import { CompositeFunctions, Scales } from "./scale";

function BinaryCalculate(scale: ScaleName, data: { index: number; value: boolean; }[]) {
  const result: { name: string, score: number }[] = []

  for (const SubScaleName in Scales[scale]) {
    try {
      // @ts-ignore
      const SubScaleMeta = Scales[scale][SubScaleName];
      let SubScale: SingleScale | SingleWeightedScale | PairScale | ShiftScale | CountScale;

      switch (SubScaleMeta.type) {
        case 'single':
          SubScale = new SingleScale(SubScaleMeta.items.T, SubScaleMeta.items.F)
          break;
        case 'single-weighted':
          SubScale = new SingleWeightedScale(SubScaleMeta.items)
          break
        case 'pair':
          SubScale = new PairScale({ ...SubScaleMeta.items }, SubScaleMeta.bias)
          break;
        case 'shift':
          SubScale = new ShiftScale()
          break;
        case 'count':
          SubScale = new CountScale(SubScaleMeta.start, SubScaleMeta.count)
          break;
      }

      // @ts-ignore
      result.push({ name: SubScaleName, score: SubScale.score(data) })
    } catch (error) {

      console.error(`Error in Scale ${scale}, Subscale ${SubScaleName}`, error);
    }
  }

  return result.reduce((a, v) => ({ ...a, [v.name]: v.score }), {})
}

function PentanaryCalculate(scale: ScaleName, data: { index: number; value: number; }[]) {
  const result: { name: string, score: number }[] = []

  for (const SubScaleName in Scales[scale]) {
    // @ts-ignore
    const SubScaleMeta = Scales[scale][SubScaleName];
    let SubScale: AverageScale | SumScale | CountScale;

    switch (SubScaleMeta.type) {
      case 'average':
        if (typeof SubScaleMeta.weight === 'number')
          SubScale = new AverageScale(SubScaleMeta.items, SubScaleMeta.weight)
        else
          SubScale = new AverageScale(SubScaleMeta.items, result.find((scale) => scale === SubScaleMeta.weight)?.score ?? 0)
        break;
      case 'sum':
        SubScale = new SumScale(SubScaleMeta.items)
        break
      case 'count':
        SubScale = new CountScale(SubScaleMeta.start, SubScaleMeta.count, SubScaleMeta.label, SubScaleMeta.inverse)
        break;
    }

    // @ts-ignore
    result.push({ name: SubScaleName, score: SubScale.score(data) })
  }

  if (scale in CompositeFunctions)
    // @ts-ignore
    result.push(...CompositeFunctions[scale](result))
  return result.reduce((a, v) => ({ ...a, [v.name]: v.score }), {})
}

export { BinaryCalculate, PentanaryCalculate }
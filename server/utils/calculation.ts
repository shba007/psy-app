import { ScaleName } from '../../utils/models';
import { BinaryCountScale, PairScale, PentanaryAverageScale, PentanaryCountScale, ShiftScale, SingleScale, SingleWeightedScale } from './class';
import { Scales } from "./scale";

function BinaryCalculate(scale: ScaleName, data: { index: number; value: boolean; }[]) {
  const result: { name: string, score: number }[] = []

  for (const SubScaleName in Scales[scale]) {
    try {
      // @ts-ignore
      const SubScaleMeta = Scales[scale][SubScaleName];
      let SubScale: SingleScale | SingleWeightedScale | PairScale | ShiftScale | BinaryCountScale;

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
        case 'binary-count':
          SubScale = new BinaryCountScale(SubScaleMeta.start, SubScaleMeta.count)
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
    let SubScale: PentanaryAverageScale | PentanaryCountScale;

    switch (SubScaleMeta.type) {
      case 'pentanary-average':
        if (typeof SubScaleMeta.modifier === 'number')
          SubScale = new PentanaryAverageScale(SubScaleMeta.items, SubScaleMeta.modifier)
        else
          SubScale = new PentanaryAverageScale(SubScaleMeta.items, result.find((scale) => scale === SubScaleMeta.modifier)?.score ?? 0)
        break;
      case 'pentanary-count':
        SubScale = new PentanaryCountScale(SubScaleMeta.items,)
        break
    }

    // @ts-ignore
    result.push({ name: SubScaleName, score: SubScale.score(data) })
  }

  return result.reduce((a, v) => ({ ...a, [v.name]: v.score }), {})
}

export { BinaryCalculate, PentanaryCalculate }
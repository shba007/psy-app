class BinaryScale {
  // TODO:
}

class SingleScale {
  private trueIndices: number[];
  private falseIndices: number[];

  constructor(trueIndices: number[], falseIndices: number[]) {
    this.trueIndices = trueIndices;
    this.falseIndices = falseIndices;
  }

  score(responses: { index: number; value: boolean }[]): number {
    let totalTrueCount = 0;
    let totalFalseCount = 0;

    responses.forEach((response) => {
      // Answer index should be start with 1
      totalTrueCount += Number(this.trueIndices.includes(response.index) && response.value === true);
      totalFalseCount += Number(this.falseIndices.includes(response.index) && response.value === false);

      /* if (this.falseIndices.includes(response.index)) {
        console.log({ index: response.index, totalFalseCount });
      } */
    });

    // console.log({ totalTrueCount, totalFalseCount });
    return totalTrueCount + totalFalseCount;
  }

  count(): number {
    return this.trueIndices.length + this.falseIndices.length;
  }
}

// TODO: Single Weighted scale
class SingleWeightedScale {
  private subScales: {
    condition: boolean,
    weight: number | number[],
    indexes: number[]
  }[]

  constructor(subScales: { condition: boolean, weight: number, indexes: number[] }[]) {
    this.subScales = subScales
  }

  score(responses: { index: number; value: boolean }[]): number {
    return this.subScales
      .reduce((total, subScales) => total + subScales.indexes
        .reduce((total, index, indexIndex) => total + (typeof subScales.weight == "number" ? subScales.weight : subScales.weight[indexIndex]) * Number(subScales.condition ? responses[index - 1].value : !responses[index - 1].value), 0), 0)
  }
}

class PairScale {
  private TT: { indices: number[][]; weight: number };
  private TF: { indices: number[][]; weight: number };
  private FT: { indices: number[][]; weight: number };
  private FF: { indices: number[][]; weight: number };
  private bias: number;

  constructor(
    { TT = { indices: [], weight: 1 }, TF = { indices: [], weight: 1 }, FT = { indices: [], weight: 1 }, FF = { indices: [], weight: 1 } },
    bias = 0
  ) {
    this.TT = TT;
    this.TF = TF;
    this.FT = FT;
    this.FF = FF;
    this.bias = bias;
  }

  score(responses: { index: number; value: boolean }[]): number {
    let TTCount = 0;
    let TFCount = 0;
    let FTCount = 0;
    let FFCount = 0;

    this.TT.indices.forEach((index) => {
      TTCount += Number(responses[index[0] - 1].value == true && responses[index[1] - 1].value == true) * this.TT.weight;
    });

    this.TF.indices.forEach((index) => {
      TFCount += Number(responses[index[0] - 1].value == true && responses[index[1] - 1].value == false) * this.TF.weight;
    });

    this.FT.indices.forEach((index) => {
      FTCount += Number(responses[index[0] - 1].value == false && responses[index[1] - 1].value == true) * this.FT.weight;
    });

    this.FF.indices.forEach((index) => {
      FFCount += Number(responses[index[0] - 1].value == false && responses[index[1] - 1].value == false) * this.FF.weight;
    });

    return TTCount + TFCount + FTCount + FFCount + this.bias;
  }
}

class ShiftScale {
  private TFShift: boolean;
  private FTShift: boolean;

  constructor({ TFShift = true, FTShift = true } = { TFShift: true, FTShift: true }) {
    this.TFShift = TFShift;
    this.FTShift = FTShift;
  }

  score(responses: { index: number; value: boolean }[]): number {
    let TFShiftCount = 0;
    let FTShiftCount = 0;
    let lastAnswer: {
      index: number;
      value: boolean;
    } | undefined = undefined;

    for (const response of responses) {
      if (lastAnswer && lastAnswer.value !== response.value) {
        lastAnswer.value === true ? TFShiftCount++ : FTShiftCount++;
      }

      lastAnswer = response;
    }

    return Number(this.TFShift) * TFShiftCount + Number(this.FTShift) * FTShiftCount;
  }
}

class CountScale {
  private Start: number;
  private Count: number;
  private Type: boolean;

  constructor(Start: number, Count: number, Type = true) {
    this.Start = Start;
    this.Count = Count;
    this.Type = Type;
  }

  score(responses: { index: number; value: boolean }[]): number {
    return responses.slice(this.Start - 1, this.Start - 1 + this.Count)
      .reduce((sum, response) => sum + Number(response.value === this.Type), 0);
  }
}

class AverageRatingScale {
  private indices: number[];
  private modifier: number;

  constructor(indices: number[], modifier: number) {
    this.indices = indices
    this.modifier = modifier;
  }

  score(responses: { index: number; value: number }[]): number {
    return Math.round((this.indices.reduce((sum, index) => sum + responses[index - 1].value, 0) / this.indices.length) * 100) / 100
  }
}

export { SingleScale, SingleWeightedScale, PairScale, ShiftScale, CountScale, AverageRatingScale };

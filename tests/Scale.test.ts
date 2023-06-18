import { describe, expect, test } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils'

import { Data } from '../server/utils/scale';
import { BinaryCalculate, PentanaryCalculate } from "../server/utils/calculation";

describe('Helper Functions Test', () => {
  test('Mapper Function', () => {
    // expect().toMatchObject()
  });
})

describe('Binary Scale Test', () => {
  test('MACI Scale Test', () => {
    const scale = "MACI"
    expect(BinaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
  });

  test('MCMI Scale Test', () => {
    const scale = "MCMI"
    expect(BinaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
  });

  test('MMPI-RF Scale Test', () => {
    const scale = "MMPI-RF"
    expect(BinaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
  });

  test('TCI Scale Test', () => {
    const scale = "TCI"
    expect(BinaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
  });

  test('MPQ Scale Test', () => {
    const scale = "MPQ"
    expect(BinaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
  });

  test('EPQ Scale Test', () => {
    const scale = "EPQ"
    expect(BinaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
  });

  test('EPQ-R Scale Test', () => {
    const scale = "EPQ-R"
    expect(BinaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
  });

  test('JTCI Scale Test', () => {
    const scale = "JTCI"
    expect(BinaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
  });

  /*  test('JEPQ Scale Test', () => {
     const scale = "JEPQ"
     expect(BinaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
   }); */

  /* test('LEYTON Scale Test', () => {
    const scale = "LEYTON"
    expect(BinaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
  }); */
})

describe('Pentanary Scale Test', () => {
  test('SCL-90R Scale Test', () => {
    const scale = "SCL-90R"
    expect(PentanaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
  });

  /* test('DSMD Child Scale Test', () => {
      const scale = "DSMD-C"
      expect(PentanaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
    }); */

  test('DSMD Adolescent Scale Test', () => {
    const scale = "DSMD-A"
    expect(PentanaryCalculate(scale, Data[scale].responses)).toMatchObject(Data[scale].result)
  });
})
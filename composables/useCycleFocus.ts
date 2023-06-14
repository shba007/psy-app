import { MaybeComputedRef, MaybeRef } from "@vueuse/shared"

export interface UseCycleFocusOptions<HTMLElement> {
  /**
   * The initial value of the state.
   * A ref can be provided to reuse.
   */
  initialValue?: MaybeRef<HTMLElement>

  /**
   * The default index when
   */
  fallbackIndex?: number

  /*  */
  isLoop?: boolean
  /**
   * Custom function to get the index of the current value.
   */
  getIndexOf?: (value: HTMLElement, list: HTMLElement[]) => number

}

/**
 * Cycle through a list of items
 *
 * @see https://vueuse.org/useCycleFocus
 */
export function useCycleFocus<HTMLElement>(list: MaybeComputedRef<HTMLElement[]>, options?: UseCycleFocusOptions<HTMLElement>): UseCycleFocusReturn<HTMLElement> {
  const state = shallowRef(getInitialValue()) as Ref<HTMLElement>
  const listRef = resolveRef(list)

  const { isLoop = true } = options

  const index = computed<number>({
    get() {
      const targetList = resolveUnref<HTMLElement[]>(list)

      let index = options?.getIndexOf
        ? options.getIndexOf(state.value, targetList)
        : targetList.indexOf(state.value)

      if (index < 0)
        index = options?.fallbackIndex ?? 0

      return index
    },
    set(v) {
      set(v)
    },
  })

  function set(i: number) {
    const targetList = listRef.value
    const length = targetList.length

    if (!(i >= 0 && i < length) && !isLoop)
      return targetList[i]

    const index = (i % length + length) % length
    const value = targetList[index]
    value.focus()
    state.value = value
    return value
  }

  function shift(delta = 1) {
    return set(index.value + delta)
  }

  function next(n = 1) {
    return shift(n)
  }

  function prev(n = 1) {
    return shift(-n)
  }

  function getInitialValue() {
    return resolveUnref(options?.initialValue ?? resolveUnref<HTMLElement[]>(list)[0]) ?? undefined
  }

  watch(listRef, () => set(index.value))

  return {
    state,
    index,
    next,
    prev,
  }
}

export interface UseCycleFocusReturn<HTMLElement> {
  state: Ref<HTMLElement>
  index: Ref<number>
  next: (n?: number) => HTMLElement
  prev: (n?: number) => HTMLElement
}
import { renderHook, act } from "@testing-library/react";
import useCVC from "./useCVC";
import { ERROR_MESSAGE } from "../constants";

describe("신용카드 CVC 입력 테스트", () => {
  const initialValue = {
    cvc: "99",
  };

  it("초기값이 정확히 설정되어야 한다.", () => {
    const { result } = renderHook(() => useCVC(initialValue));

    expect(result.current.inputValue).toEqual(initialValue);
  });

  it("입력값 숫자일 떄 정확히 업데이트 되어야 한다.", () => {
    const userInput = "129";
    const { result } = renderHook(() => useCVC(initialValue));
    const target = { value: userInput, name: "cvc" };
    const expectedValidationResult = {
      isValid: true,
      errorMessage: "",
    };

    act(() => {
      result.current.handleCvcChange({
        target,
        currentTarget: target,
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.inputValue.cvc).toEqual(userInput);
    expect(result.current.validationResult).toEqual(expectedValidationResult);
  });

  it("입력값이 숫자가 아닐 때 업데이트가 안된다", () => {
    const userInput = "notUpdate";
    const { result } = renderHook(() => useCVC(initialValue));
    const target = { value: userInput, name: "cvc" };
    const expectedValidationResult = {
      isValid: false,
      errorMessage: ERROR_MESSAGE.onlyNumber,
    };

    act(() => {
      result.current.handleCvcChange({
        target,
        currentTarget: target,
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.inputValue.cvc).not.toEqual(userInput);
    expect(result.current.validationResult).toEqual(expectedValidationResult);
  });

  it("입력값이 3자리 초과시 업데이트가 안된다", () => {
    const userInput = "1234";
    const { result } = renderHook(() => useCVC(initialValue));
    const target = { value: userInput, name: "cvc" };
    const expectedValidationResult = {
      isValid: false,
      errorMessage: ERROR_MESSAGE.onlyNumber,
    };

    act(() => {
      result.current.handleCvcChange({
        target,
        currentTarget: target,
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.inputValue.cvc).not.toEqual(userInput);
    expect(result.current.validationResult).toEqual(expectedValidationResult);
  });

  it("입력 값이 모두 채워지고 블러/엔터 이벤트 발생 시 에러가 발생하지 않는다", () => {
    const userInput = "123";
    const { result } = renderHook(() => useCVC(initialValue));
    const target = { value: userInput, name: "cvc" };
    const expectedValidationResult = {
      isValid: true,
      errorMessage: "",
    };

    act(() => {
      result.current.handleCvcBlur({
        target,
        currentTarget: target,
      } as React.FocusEvent<HTMLInputElement>);
    });

    expect(result.current.inputValue.cvc).toEqual(userInput);
    expect(result.current.validationResult).toEqual(expectedValidationResult);
  });

  it("입력 값이 모두 채워지지 않고 블러/엔터 이벤트 발생 시 에러가 발생한다", () => {
    const userInput = "12";
    const { result } = renderHook(() => useCVC(initialValue));
    const target = { value: userInput, name: "cvc" };
    const expectedValidationResult = {
      isValid: false,
      errorMessage: ERROR_MESSAGE.cvcOutOfRange,
    };

    act(() => {
      result.current.handleCvcBlur({
        target,
        currentTarget: target,
      } as React.FocusEvent<HTMLInputElement>);
    });

    expect(result.current.inputValue.cvc).not.toEqual(userInput);
    expect(result.current.validationResult).toEqual(expectedValidationResult);
  });
});

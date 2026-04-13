import React from "react";
import { CustomTextInputProps } from "@rinn7e/tea-cup-form/lib/update";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";

export const standardInputUi =
  (
    isTextarea: boolean,
    onKeyDown: O.Option<(e: React.KeyboardEvent) => void> = O.none,
  ) =>
  (props: CustomTextInputProps) => {
    const isError = E.isLeft(props.validationResult) && props.showValidation;
    const commonClasses = `w-full px-4 py-3 border rounded outline-none transition-colors ${
      isError ? "border-red-500" : "border-gray-300 focus:border-brand-primary"
    }`;

    if (isTextarea) {
      return (
        <fieldset className="form-group mb-4">
          <textarea
            className={commonClasses}
            rows={8}
            placeholder={props.placeholder}
            value={props.currentValue}
            onChange={(e) =>
              props.dispatch({
                _tag: "UpdateForm",
                key: props.key,
                event: e as any,
              })
            }
            onFocus={() =>
              props.dispatch({
                _tag: "HandleFocus",
                key: props.key,
                isFocus: true,
              })
            }
            onBlur={() =>
              props.dispatch({
                _tag: "HandleFocus",
                key: props.key,
                isFocus: false,
              })
            }
            onKeyDown={(e) => {
              if (O.isSome(onKeyDown)) {
                onKeyDown.value(e);
              }
            }}
          />
          {props.showValidation &&
            pipe(
              props.validationResult,
              E.fold(
                (err) => (
                  <span className="text-red-500 text-sm mt-1 block">{err}</span>
                ),
                () => null,
              ),
            )}
        </fieldset>
      );
    }

    return (
      <fieldset className="form-group mb-4">
        <input
          className={commonClasses}
          type={
            props.isPassword._tag === "Some"
              ? props.isPassword.value.revealPassword
                ? "text"
                : "password"
              : "text"
          }
          placeholder={props.placeholder}
          value={props.currentValue}
          onInput={(e) =>
            props.dispatch({
              _tag: "UpdateForm",
              key: props.key,
              event: e as any,
            })
          }
          onFocus={() =>
            props.dispatch({
              _tag: "HandleFocus",
              key: props.key,
              isFocus: true,
            })
          }
          onBlur={() =>
            props.dispatch({
              _tag: "HandleFocus",
              key: props.key,
              isFocus: false,
            })
          }
          onKeyDown={(e) => {
            if (O.isSome(onKeyDown)) {
              onKeyDown.value(e);
            }
          }}
        />
        {props.showValidation &&
          pipe(
            props.validationResult,
            E.fold(
              (err) => (
                <span className="text-red-500 text-sm mt-1 block">{err}</span>
              ),
              () => null,
            ),
          )}
      </fieldset>
    );
  };

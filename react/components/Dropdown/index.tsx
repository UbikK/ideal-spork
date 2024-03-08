"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./styles.module.scss";

type Option = {
  value: string;
  label: string;
};

type DropdownPropsType = {
  multiple?: boolean;
  label: string;
  options: Option[];
  model: Function;
  type?: "form" | "inline";
  defaultValue?: string;
};

export default function Dropdown({
  multiple = false,
  label,
  options,
  model,
  type = "form",
  defaultValue,
}: DropdownPropsType) {
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [checkedOptions, setCheckedOptions] = useState<string[]>(
    defaultValue ? [defaultValue] : []
  );
  const [inputLabel, setInputLabel] = useState<string>(
    defaultValue
      ? defaultValue
      : `Choisir${multiple ? " (plusieurs choix possibles)" : ""}`
  );
  const ref = useRef(null);

  const handleCheckAction = (value: string) => {
    if (checkedOptions.includes(value)) {
      const newIds = [...checkedOptions];
      newIds.splice(newIds.indexOf(value), 1);
      model(newIds);
      setCheckedOptions(newIds);
      setInputLabel(
        newIds.length
          ? options
              .filter((opt) => newIds.includes(opt.value))
              .map((opt) => opt.label)
              .join("; ")
          : inputLabel
      );
    } else {
      const values = multiple ? [...checkedOptions, value] : [value];
      model(values);
      setCheckedOptions(values);
      const newInput = values.length
        ? options
            .filter((opt) => values.includes(opt.value))
            .map((opt) => opt.label)
            .join("; ")
        : inputLabel;

      setInputLabel(newInput);
    }
    if (!multiple) setIsDropdownOpened(false);
  };
  const handleClickOutside = () => {
    setIsDropdownOpened(false);
  };
  useOnClickOutside(ref, handleClickOutside);

  return (
    <div
      className={`${styles.customSelect} ${
        type === "inline" ? styles.inline : ""
      }`}
      ref={ref}
    >
      <label htmlFor="dropbox">{label}</label>
      <button
        className={styles.selectButton}
        role="combobox"
        aria-labelledby="select button"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-controls="select-dropdown"
        name="dropbox"
        onClick={(e) => {
          e.preventDefault();
          setIsDropdownOpened(!isDropdownOpened);
        }}
      >
        <span
          className={`${styles.selectedValue} ${
            checkedOptions.length ? "" : styles.placeholder
          }`}
        >
          {inputLabel}
        </span>
        <span className={styles.arrowButton}>
          <Image
            src="/icons/chevron-down.svg"
            alt="chevron"
            height={16}
            width={16}
            className={`${styles.arrow} ${
              isDropdownOpened ? styles.active : ""
            }`}
          />
        </span>
      </button>
      <ul
        role="listbox"
        id="select-dropdown"
        className={`${styles.selectDropdown} ${
          isDropdownOpened ? styles.active : ""
        } ${type === "inline" ? styles.inline : ""}`}
      >
        {options.map((option, index) => {
          return (
            <li
              role="option"
              key={`${option.label}-${index}`}
              onClick={() => handleCheckAction(option.value)}
              aria-selected={checkedOptions?.includes(option.value)}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                value={option.value}
                name={option.label}
                checked={checkedOptions?.includes(option.value)}
                onChange={() => {}}
              />
              <label htmlFor={option.value}>{option.label}</label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import "moment/locale/es";
import es from "date-fns/locale/es";

registerLocale("es", es);

interface IDateInputProps {
  className?: string;
  currentDate: Date;
  setCurrentDate(date: Date): void;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  maxDate?: Date;
  minDate?: Date;
  isWeekday?: boolean;
  name: string;
  placeholder?: string;
}

const DateInput: React.FunctionComponent<IDateInputProps> = ({
  className,
  currentDate,
  setCurrentDate,
  showYearDropdown,
  showMonthDropdown,
  maxDate,
  minDate,
  isWeekday,
  name,
  placeholder,
}) => {
  moment.locale("es");

  const onChange = (date: Date) => {
    setCurrentDate(
      moment(date)
        .set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
        .toDate()
    );
  };

  const filterDate = (date: Date) => {
    if (isWeekday) return date.getDay() !== 0;
    return true;
  };

  return (
    <DatePicker
      className={className}
      selected={currentDate}
      onChange={onChange}
      value={moment(currentDate).format("dddd D [de] MMMM [de] YYYY")}
      locale="es"
      showYearDropdown={showYearDropdown}
      showMonthDropdown={showMonthDropdown}
      maxDate={maxDate}
      minDate={minDate}
      filterDate={filterDate}
      name={name}
      placeholderText={placeholder}
    />
  );
};

export default DateInput;

import { Popover, PopoverContent, PopoverTrigger, Input } from '@nextui-org/react';
import dayjs from 'dayjs';
import { CalendarIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DayPicker } from "react-day-picker"
import 'react-day-picker/dist/style.css'

import { cn, formatDate } from '@/lib/utils';
import { InputProps } from "@nextui-org/react";
import useToggle from '@/hooks/useToggle';

export function DatePicker({
  placeholder,
  onChange,
  value,
  ...rest
}: Omit<InputProps, 'onChange'> & { onChange?: (val?: string) => void }) {
  const [open, actions] = useToggle();
  const [date, setDate] = useState<string>();

  useEffect(() => {
    typeof value !== 'undefined' && setDate(value);
  }, [value]);

  return (
    <Popover isOpen={open} onOpenChange={actions.setVisible}>
      <PopoverTrigger className="text-left">
        <Input
          {...rest}
          startContent={
            <div
              onClick={rest?.onClick}
              className="absolute flex gap-2 flex-shrink-0 items-center z-10"
            >
              <div>
                <CalendarIcon size="20px" />
              </div>{' '}
              {!date && (
                <span className="text-foreground-500 font-normal w-full text-left text-small truncate">
                  {placeholder}
                </span>
              )}
            </div>
          }
          endContent={
            date && (
              <X
                size="20px"
                className="cursor-pointer"
                onClick={(e) => {
                  e?.stopPropagation();
                  e?.preventDefault();
                  setDate('');
                  onChange?.(undefined);
                }}
              />
            )
          }
          placeholder={placeholder}
          value={formatDate(date, false)}
          classNames={{
            input: cn('text-left ps-[30px!important] pt-5 z-20 h-full'),
            innerWrapper: 'flex'
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DayPicker
          mode="single"
          selected={dayjs(date).toDate()}
          onSelect={(_val) => {
            const _date = dayjs(_val).toISOString();
            setDate(_date);
            onChange?.(_date);
            actions.onHidden();
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
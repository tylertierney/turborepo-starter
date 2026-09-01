import { ComponentProps, Dispatch, SetStateAction } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { ChevronDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import { Label } from './label'
import { Checkbox } from './checkbox'

export type MultiselectItem = {
  id: string
  label: string
  disabled?: boolean
}

export type MultiselectProps = {
  triggerLabel: string
  value: string[]
  setValue: Dispatch<SetStateAction<string[]>>
  options: MultiselectItem[]
  heading?: string
  placeholder?: string
}

export const Multiselect = ({
  triggerLabel = '',
  value = [],
  setValue,
  options = [],
  heading = '',
  placeholder = '',
  children,
}: MultiselectProps & ComponentProps<'button'>) => {
  const set = new Set<string>(value)

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm">
            {children || (
              <>
                {triggerLabel} {value.length ? `(${value.length})` : ''}{' '}
                <ChevronDown />
              </>
            )}
          </Button>
        }
      />
      <PopoverContent className="max-h-80 px-1">
        <Command className="max-w-sm p-0">
          <CommandInput placeholder={placeholder ?? ''} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading={heading}>
              {options.map(({ id, label, disabled = false }) => {
                return (
                  <CommandItem
                    key={id}
                    disabled={disabled}
                    className="p-0"
                    hideIcon={true}
                    onSelect={() => {
                      if (value.includes(id)) {
                        setValue((prev) =>
                          prev.filter((existingId) => existingId !== id),
                        )
                      } else {
                        setValue((prev) => [...prev, id])
                      }
                    }}
                  >
                    <Label className="grow p-2">
                      <Checkbox
                        checked={set.has(id)}
                        // onCheckedChange={(c) => {
                        //   if (c) {
                        //     const deduped = new Set([...value, id])
                        //     setValue(Array.from(deduped))
                        //   } else {
                        //     setValue((prev) =>
                        //       prev.filter((existingId) => existingId !== id),
                        //     )
                        //   }
                        // }}
                      />
                      {label}
                    </Label>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
          <div className="flex justify-end p-1 gap-2">
            <Button variant="outline" size="sm" onClick={() => setValue([])}>
              Clear
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setValue(options.map(({ id }) => id))}
            >
              Select All
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

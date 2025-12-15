import { useId, useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type ComboboxOption = {
    value: string
    label: string
}

type ComboboxProps = {
    value: string[]
    onValueChange: (value: string[]) => void
    options: ComboboxOption[]
    placeholder?: string
    label?: string
    disabled?: boolean
}

const Combobox = ({
                      value,
                      onValueChange,
                      options,
                      placeholder = 'Select items',
                      label,
                      disabled = false
                  }: ComboboxProps) => {
    const id = useId()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const toggleSelection = (optionValue: string) => {
        if (disabled) return
        onValueChange(
            value.includes(optionValue)
                ? value.filter(v => v !== optionValue)
                : [...value, optionValue]
        )
    }

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="w-full space-y-2">
            {label && <Label htmlFor={id}>{label}</Label>}

            <Popover
                open={open}
                onOpenChange={(o) => {
                    if (!disabled) setOpen(o)
                    if (!o) setSearch('')
                }}
            >
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={`h-auto min-h-8 w-full justify-between bg-transparent hover:bg-transparent
                            ${
                                disabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`
                        }
                    >
                        {value.length > 1 ? (
                            <span>{value.length} items selected</span>
                        ) : value.length === 1 ? (
                            <span>1 item selected</span>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}

                        <ChevronsUpDownIcon
                            className="text-muted-foreground/80 shrink-0"
                            aria-hidden="true"
                        />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-(--radix-popper-anchor-width) p-0 bg-transparent">
                    <Command>
                        <CommandInput
                            placeholder="Search items..."
                            value={search}
                            onValueChange={(val) => !disabled && setSearch(val)}
                        />

                        <CommandList>
                            {filteredOptions.length === 0 && (
                                <CommandEmpty>No results found.</CommandEmpty>
                            )}

                            <CommandGroup>
                                {filteredOptions.map(option => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label} // search matches label
                                        onSelect={() => toggleSelection(option.value)}
                                    >
                                        <span className="truncate">{option.label}</span>
                                        {value.includes(option.value) && (
                                            <CheckIcon size={16} className="ml-auto" />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default Combobox

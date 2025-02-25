import { SearchIcon } from 'lucide-react'

export const SearchBar = () => {
  return (
    <div className="flex items-center justify-between rounded-md py-1 px-3 gap-2 bg-[#FFFFFF] border border-[#D5D7DA] shadow-[0_1px_2px_0_#0A0D120D]">
      <div className="flex items-center gap-2">
        <SearchIcon className="size-4 text-[#717680]" />
        <span className="text-base leading-6 font-[400] tracking-[0] text-[#717680]">Search</span>
      </div>
      <div className="flex items-center rounded-[4px] py-[1px] px-[4px] border border-[#E9EAEB]">
        <span className="text-xs leading-[18px] font-[500] text-[#717680]">⌘K</span>
      </div>
    </div>
  )
}

import { FC } from "react";
import { User } from "@supabase/supabase-js";
import * as Form from '@radix-ui/react-form';
import { SearchIcon } from "lucide-react";

type SearchInputProps = {
  user: User | null;
};

const SearchInput: FC<SearchInputProps> = ({ user }) => {
  return (
    <div className={`flex flex-grow ${user ? "max-w-full" : "max-w-[600px]"} mr-2 items-center`}>
      <Form.Root>
        <Form.Field name="search" className="flex items-center">
          <Form.Label className="sr-only">Search Reddit</Form.Label>
          <Form.Control asChild>
            <input
              className="pl-10 pr-3 py-1.5 border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md"
              placeholder="Search Reddit"
              type="text"
            />
          </Form.Control>
          <div className="absolute ml-2 pointer-events-none text-gray-400">
            <SearchIcon/>
          </div>
        </Form.Field>
      </Form.Root>
    </div>
  );
};

export default SearchInput;
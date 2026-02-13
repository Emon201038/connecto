"use client";
import React, { useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { useLazyGetUsersQuery } from "@/redux/features/user/userApi";
import { IUser, IUsersConversation } from "@/types";
import { useSession } from "next-auth/react";

interface Props {
  isActiveSearch: boolean;
  setIsActiveSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchedUser: React.Dispatch<React.SetStateAction<IUser[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  inp: string;
  setInp: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchForm({
  isActiveSearch,
  setIsActiveSearch,
  setSearchedUser,
  setIsLoading,
  inp,
  setInp,
}: Props) {
  const debouncedValue = useDebounce(inp || "", 1000);

  const [searchUsers, { isLoading: isSearching, isError }] =
    useLazyGetUsersQuery();

  useEffect(() => {
    if (setIsLoading) setIsLoading(isSearching);
  }, [isSearching, setIsLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInp(e.target.value);
  };

  React.useEffect(() => {
    if (!debouncedValue.trim()) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await searchUsers({
          search: debouncedValue,
          additionalFields: `conversation { 
            id
            hasConversation
            lastMessage {
              content
              sender {
                _id
              }
            }
          }`,
        }).unwrap();
        setSearchedUser(res.data.users as unknown as IUser[]);
      } catch (error) {
        toast.error("Failed to search");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [debouncedValue, searchUsers]);
  return (
    <form className="relative flex gap-2 items-center">
      {isActiveSearch && (
        <Button
          type="button"
          variant={"ghost"}
          onClick={() => setIsActiveSearch((prev) => !prev)}
        >
          <ArrowLeft />
        </Button>
      )}
      <div className="flex-1 relative">
        <Input
          onClick={() => setIsActiveSearch(true)}
          onChange={handleChange}
          className="w-full pl-8 rounded-full focus:border-none focus:outline-0"
          placeholder="searh"
        />
        <div className="absolute -translate-y-1/2 top-1/2 left-3 opacity-40">
          <Search size={18} />
        </div>
      </div>
    </form>
  );
}

"use client";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { set } from "zod";

const UserFilter = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accountStatus, setAccountStatus] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const debouncedAccountStatus = useDebounce(accountStatus, 500);
  const debouncedGender = useDebounce(gender, 500);
  const debouncedRole = useDebounce(role, 500);

  const setOrDelete = (params: URLSearchParams, key: string, value: string) => {
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  };

  useEffect(() => {
    const statusFromUrl = searchParams.get("status") || "";
    const genderFromUrl = searchParams.get("gender") || "";
    const roleFromUrl = searchParams.get("role") || "";

    setAccountStatus(statusFromUrl);
    setGender(genderFromUrl);
    setRole(roleFromUrl);
  }, [searchParams]);

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    setOrDelete(params, "status", debouncedAccountStatus);
    setOrDelete(params, "gender", debouncedGender);
    setOrDelete(params, "role", debouncedRole);

    const queryString = params.toString();

    startTransition(() => {
      // If no params left → remove "?"
      if (queryString) {
        router.push(`?${queryString}`);
      } else {
        router.push(window.location.pathname);
      }
    });
  }, [
    debouncedAccountStatus,
    debouncedGender,
    debouncedRole,
    router,
    searchParams,
    startTransition,
  ]);

  const clearFilters = () => {
    setAccountStatus("");
    setGender("");
    setRole("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    params.delete("gender");
    params.delete("role");
    params.set("page", "1");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  const activeFiltersCount =
    (debouncedAccountStatus ? 1 : 0) +
      (debouncedGender ? 1 : 0) +
      (debouncedRole ? 1 : 0) +
      (searchParams.get("search") ? 1 : 0) +
      parseInt(searchParams.get("page") || "1") >
    1
      ? 1
      : 0;

  return (
    <div className="flex gap-3 items-center">
      <SearchFilter
        paramsName="search"
        placeholder="Search by name email phone"
      />
      <Select
        value={accountStatus}
        onValueChange={setAccountStatus}
        disabled={isPending}
      >
        <SelectTrigger>
          <SelectValue placeholder="Account Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem onClick={(e) => console.log(e)} value="ALL">
            ALL
          </SelectItem>
          <SelectItem value="isDisabled">Disabled</SelectItem>
          <SelectItem value="isDeleted">Deleted</SelectItem>
        </SelectContent>
      </Select>
      <Select value={gender} onValueChange={setGender}>
        <SelectTrigger>
          <SelectValue placeholder="Select Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">ALL</SelectItem>
          <SelectItem value="MALE">Male</SelectItem>
          <SelectItem value="FEMALE">FEMALE</SelectItem>
        </SelectContent>
      </Select>
      {/* <SelectFilter
        options={[
          { label: "Male", value: "MALE" },
          { label: "Female", value: "FEMALE" },
        ]}
        paramsName="gender"
        placeholder="Gender"
      /> */}
      <RefreshButton />
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          disabled={isPending}
          className="h-10 px-3"
        >
          <X className="h-4 w-4 mr-1" />
          Clear ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
};

export default UserFilter;

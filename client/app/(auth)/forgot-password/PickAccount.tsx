import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { IAccount } from "./page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { OctagonAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProfileImageUrl } from "@/helper/renderImage";

interface IProps {
  accounts: IAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<IAccount[]>>;
  setIsSearched: React.Dispatch<React.SetStateAction<boolean>>;
}
const PickAccount = ({ accounts, setAccounts, setIsSearched }: IProps) => {
  const router = useRouter();
  return (
    <Card className="p-0 gap-0 w-full max-w-md">
      <h1 className="leading-none font-semibold p-[18px]">
        Identify your account
      </h1>
      <Separator />
      <CardContent className="px-0 py-4">
        {accounts.length === 0 ? (
          <div className="space-y-2">
            <div className="w-full flex flex-col justify-center items-center gap-1">
              <OctagonAlert />
              <p>No accounts matched your search</p>
            </div>
            <Separator />
            <div className="flex justify-end items-center px-4">
              <Button
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setIsSearched(false)}
              >
                Back
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-4 space-y-4">
            <p>These accounts matched your search.</p>
            {accounts.map((account) => (
              <div key={account.id} className="space-y-1">
                <div className="space-y-2 flex w-full justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={
                          account?.profilePicture?.url ||
                          "/images/default-profile.svg"
                        }
                      />
                      <AvatarFallback>
                        {account.fullName?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="">{account.fullName}</p>
                      <p className="text-sm tracking-tighter text-[#606770] font-[450]">
                        Connecto user
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      router.push(
                        `/forgot-password/recover?email=${encodeURIComponent(
                          account.email
                        )}&id=${account.id}`
                      )
                    }
                    className="cursor-pointer"
                    variant="secondary"
                  >
                    This is my account
                  </Button>
                </div>
                <Separator />
              </div>
            ))}
            <div className="flex justify-end items-center w-full">
              <Button
                onClick={() => {
                  setIsSearched(false);
                  setAccounts([]);
                }}
                variant="secondary"
                className="cursor-pointer"
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PickAccount;

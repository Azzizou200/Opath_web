"use client";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChangeEvent, useState } from "react";

type RegisterFormProps = {
  onImageSelect?: (file: File) => void;
};

export default function RegisterForm({ onImageSelect }: RegisterFormProps) {
  const [preview, setPreview] = useState("");

  return (
    <Avatar className="w-40 h-40 mr-5">
      <AvatarImage src={preview} />
      <Input
        className="absolute inset-0 self-center h-full w-full opacity-0 cursor-pointer"
        accept="image/*"
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            setPreview(URL.createObjectURL(file));
            onImageSelect?.(file); // pass it to parent
          }
        }}
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

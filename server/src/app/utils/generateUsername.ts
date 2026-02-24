import prisma from "../config/db";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // replace space with -
    .replace(/-+/g, "-"); // remove duplicate -
};

export const generateUsername = async (
  firstName: string,
  lastName?: string | null,
) => {
  const baseUsername = slugify(
    lastName ? `${firstName}-${lastName}` : firstName,
  );

  const existingUsers = await prisma.user.findMany({
    where: {
      username: {
        startsWith: baseUsername,
      },
    },
    select: { username: true },
  });

  if (existingUsers.length === 0) {
    return baseUsername;
  }

  const suffixNumbers = existingUsers.map((user) => {
    const match = user.username.match(new RegExp(`^${baseUsername}-(\\d+)$`));
    return match ? parseInt(match[1]) : 0;
  });

  const maxSuffix = Math.max(...suffixNumbers);

  return `${baseUsername}-${maxSuffix + 1}`;
};

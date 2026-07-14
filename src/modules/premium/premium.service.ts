import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IPostQuery } from "../posts/post.interface";

const getPremiumContent = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "asc";

  const andCondition: PostWhereInput[] = [];

  if (query.content) {
    andCondition.push({
      OR: [
        {
          content: {
            contains: query.content as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andCondition.push({
      title: query.title,
    });
  }

  andCondition.push({
    isPremium: true,
  });

  const posts = await prisma.post.findMany({
    where: {
      AND: andCondition,
    },
    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });


  const totalPostCount = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });

  return {
    data: posts,
    meta: {
      page,
      limit,
      total: totalPostCount,
      totalPage: Math.ceil(totalPostCount / limit),
    },
  };
};

export const premiumService = {
  getPremiumContent,
};

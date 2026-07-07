import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatePostPayload,
} from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getPosts = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 3;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "asc";

  const posts = await prisma.post.findMany({
    // where: {
    //   title: "My Second Post",
    //   content: "this post content"
    // },

    //Searce & Filter -- exact match with AND operator
    // where: {
    //   AND: [
    //     {
    //       title: "My Second Post",
    //     },
    //     {
    //       content: "this post content",
    //     },
    //     {
    //       tags: {
    //         equals: ["typescript"],
    //       },
    //     },
    //   ],
    // },

    // Serarching -- partial match

    // where: {
    //   title: {
    //     contains: "first",
    //     mode: "insensitive"
    //   }
    // },

    // searching with OR operator.

    // where: {
    //   OR: [
    //     {
    //       title: {
    //         contains: "first",
    //         mode: "insensitive",
    //       },
    //     },
    //     {
    //       content: {
    //         contains: "fi",
    //         mode: "insensitive",
    //       },
    //     },
    //   ],
    // },

    // where: {
    //   AND: [
    //     // {
    //     //   OR: [
    //     //     {
    //     //       title: {
    //     //         contains: "rakib",
    //     //         mode: "insensitive",
    //     //       },
    //     //     },
    //     //     {
    //     //       content: {
    //     //         contains: "shakib",
    //     //         mode: "insensitive",
    //     //       },
    //     //     },
    //     //   ],
    //     // },
    //     {
    //       title: "My First Post",
    //     },
    //     {
    //       content: "Content of the post goes here.",
    //     },
    //   ],
    // },

    // take: 3,
    // skip: 3,

    where: {
      AND: [
        {
          OR: [
            {
              content: {
                contains: query.content as string,
                mode: "insensitive",
              },
            },
          ],
        },
        {
          title: query.title ? query.title : {},
        },
      ],
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
  return posts;
};

const getPostStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const [
      totalPost,
      totalPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalCommnets,
      totalApprovedCommnets,
      totalRejectedComments,
      totalPostViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPost,
      totalPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalCommnets,
      totalApprovedCommnets,
      totalRejectedComments,
      totalPostViews: totalPostViews._sum.views,
    };

    // const totalPost = await tx.post.count();

    // const totalPublishedPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.PUBLISHED,
    //   },
    // });
    // const totalDraftPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT,
    //   },
    // });
    // const totalArchivedPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVED,
    //   },
    // });

    // const totalCommnets = await tx.comment.count();

    // const totalApprovedCommnets = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.APPROVED,
    //   },
    // });

    // const totalRejectedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.REJECT,
    //   },
    // });

    // const totalPostViewsAgg = await tx.post.aggregate({
    //   _sum: {
    //     views: true,
    //   },
    // });

    // const totalPostViews = totalPostViewsAgg._sum.views;

    // return {
    //   totalPost,
    //   totalPublishedPost,
    //   totalDraftPost,
    //   totalArchivedPost,
    //   totalCommnets,
    //   totalApprovedCommnets,
    //   totalRejectedComments,
    //   totalPostViews,
    // };
  });

  return transactionResult;
};

const getPostById = async (postId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // throw new Error("fake error")

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  });

  return transactionResult;

  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });

  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: {
  //       where: {
  //         status: CommentStatus.APPROVED,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     },
  //     _count: {
  //       select: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });

  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  // });

  // const updatedPost = await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: true,
  //   },
  // });
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post!");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post!");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const postService = {
  getPosts,
  getPostStats,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";

import { nextAuthOptions } from "@/utils/next-auth";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, nextAuthOptions);

  if (!session) {
    return res.send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }

  return res.send({
    content: "This is protected content. You can access this content because you are signed in.",
  });
};

export default restricted;

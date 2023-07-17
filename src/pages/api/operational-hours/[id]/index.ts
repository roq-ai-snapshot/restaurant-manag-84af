import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { operationalHoursValidationSchema } from 'validationSchema/operational-hours';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.operational_hours
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getOperationalHoursById();
    case 'PUT':
      return updateOperationalHoursById();
    case 'DELETE':
      return deleteOperationalHoursById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOperationalHoursById() {
    const data = await prisma.operational_hours.findFirst(convertQueryToPrismaUtil(req.query, 'operational_hours'));
    return res.status(200).json(data);
  }

  async function updateOperationalHoursById() {
    await operationalHoursValidationSchema.validate(req.body);
    const data = await prisma.operational_hours.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteOperationalHoursById() {
    const data = await prisma.operational_hours.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

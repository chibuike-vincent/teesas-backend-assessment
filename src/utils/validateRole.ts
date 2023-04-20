import { UnauthorizedException } from "@nestjs/common";

export const checkSellerRole = (req) => {
    if (req.user.role !== "seller") {
        throw new UnauthorizedException('You are not authorized to perform this action');
    }
}

export const checkBuyerRole = (req) => {
    if (req.user.role !== 'buyer') {
        throw new UnauthorizedException('You are not authorized to perform this action');
      }
}
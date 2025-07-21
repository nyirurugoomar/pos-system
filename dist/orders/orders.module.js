"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const mongoose_1 = require("@nestjs/mongoose");
const order_schemas_1 = require("./schemas/order.schemas");
const jwt_strategy_1 = require("../auth/jwt.strategy");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: order_schemas_1.Order.name, schema: order_schemas_1.OrderSchema }])],
        providers: [orders_service_1.OrdersService, jwt_strategy_1.JwtStrategy],
        controllers: [orders_controller_1.OrdersController],
        exports: [jwt_strategy_1.JwtStrategy]
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map
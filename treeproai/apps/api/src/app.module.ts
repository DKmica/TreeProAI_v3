import { Module, MiddlewareConsumer } from "@nestjs/common";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { QuoteRequestsModule } from "./modules/quote-requests/quote-requests.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { QueuesModule } from "./queues/queues.module";
import { TenantMiddleware } from "./common/middleware/tenant.middleware";
import { EnvService } from "./config/env";

@Module({
  imports: [
    HealthModule, 
    AuthModule, 
    UploadsModule, 
    CustomersModule, 
    LeadsModule,
    QuoteRequestsModule,
    TasksModule,
    QueuesModule
  ],
  providers: [EnvService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes("*");
  }
}
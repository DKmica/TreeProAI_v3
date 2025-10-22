import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { QuoteRequestsModule } from "./modules/quote-requests/quote-requests.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { QueuesModule } from "./queues/queues.module";
import { TenantMiddleware } from "./common/middleware/tenant.middleware";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { InvoicesModule } from "./modules/invoices/invoices.module";
import { WebhooksModule } from "./modules/webhooks/webhooks.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    AuthModule,
    UploadsModule,
    CustomersModule,
    LeadsModule,
    QuoteRequestsModule,
    TasksModule,
    QueuesModule,
    QuotesModule,
    InvoicesModule,
    WebhooksModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude("healthz", "readyz", "v1/webhooks/clerk")
      .forRoutes("*");
  }
}
// ... otros imports
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    CatalogsModule,
    AuthModule,
    UsersModule,
    CallRecordsModule,
    DashboardModule, // <-- Añadir este
  ],
  // ...
})
export class AppModule {}

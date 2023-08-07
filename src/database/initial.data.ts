import { Role as RoleRepo, User as UserRepo } from "../entities";
import { hashPass } from "../utilities/bcrypt.utility";

export const createInitialData = async () => {
  console.log(hashPass("admin123."));
  const role1 = await RoleRepo.findOne({ where: { role_name: "admin" } });
  const role2 = await RoleRepo.findOne({ where: { role_name: "teacher" } });
  const role3 = await RoleRepo.findOne({ where: { role_name: "student" } });

  if (!role1 && !role2 && !role3) {
    const roleData = [
      { name: "admin" },
      { name: "teacher" },
      { name: "student" },
    ];

    for await (const data of roleData) {
      const role = RoleRepo.create({ role_name: data.name });
      await RoleRepo.save(role);
    }
  }

  const adminUser = await UserRepo.findOne({
    where: { email: "admin@admin.com" },
  });

  if (!adminUser) {
    const adminRole = await RoleRepo.findOne({ where: { role_name: "admin" } });

    if (adminRole) {
      const admin = UserRepo.create({
        email: "admin@admin.com",
        password: hashPass("admin123."),
        role: adminRole,
      });
      await UserRepo.save(admin);
    }
  }
};

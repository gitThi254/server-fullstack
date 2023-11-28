const { z } = require("zod");

exports.registerSchema = z.object({
  firstname: z
    .string({
      required_error: "firstname is required",
    })
    .min(3, { message: "username must have at least 3 characters" })
    .max(20, { message: "username must have at most 20 characters" }),
  lastname: z
    .string({
      required_error: "username is required",
    })
    .min(3, { message: "lastname must have at least 3 characters" })
    .max(20, { message: "lastname must have at most 20 characters" }),
  email: z
    .string({
      required_error: "username is required",
    })
    .email({ message: "Invalid is Email" }),
  mobile: z
    .string({
      required_error: "number is required",
    })
    .length(9, { message: "mobile must have 9 digits" }),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(6, "password must have at least 6 characters")
    .max(20, "password must have at most 20 character"),
});

exports.loginSchema = z.object({
  email: z
    .string({
      required_error: "username is required",
    })
    .email({ message: "Invalid is Email" }),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(6, "password must have at least 6 characters")
    .max(20, "password must have at most 20 character"),
});

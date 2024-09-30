import { Sequelize } from "sequelize-typescript";
import Address from "../../../domain/customer/value-object/address";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import UpdateCustomerUseCase from "./update.customer.usecase";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";

describe("Integration test for updating customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    const customer = CustomerFactory.createWithAddress(
      "John",
      new Address("Street", 123, "Zip", "City")
    );

    await customerRepository.create(customer);

    const input = {
      id: customer.id,
      name: "John Updated",
      address: {
        street: "Street Updated",
        number: 1234,
        zip: "Zip Updated",
        city: "City Updated",
      },
    };

    const output = await customerUpdateUseCase.execute(input);
    
    expect(output).toEqual(input);

    const updatedCustomer = await customerRepository.find(customer.id);
    expect(updatedCustomer.name).toBe("John Updated");
    expect(updatedCustomer.Address.street).toBe("Street Updated");
    expect(updatedCustomer.Address.number).toBe(1234);
    expect(updatedCustomer.Address.zip).toBe("Zip Updated");
    expect(updatedCustomer.Address.city).toBe("City Updated");
  });
});

import Transaction from "../models/transactionModel.js";

const transactionResolver = {
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()?._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.log("Error in creating transactions: ", error);
        throw new Error("Error in creating transactions");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (error) {
        console.log("Error in updating transactions: ", error);
        throw new Error("Error in updating transactions");
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (error) {
        console.log("Error in deleting transactions: ", error);
        throw new Error("Error in deleting transactions");
      }
    },
  },
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (error) {
        console.log("Error in getting transactions: ", error);
        throw new Error("Error in getting transactions");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.log("Error in getting transaction: ", error);
        throw new Error("Error in getting transaction");
      }
    },
  },
};

export default transactionResolver;

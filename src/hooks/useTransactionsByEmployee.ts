import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>()

  const fetchById = useCallback(
    async (employeeId: string) => {
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          employeeId,
        }
      )
      if (transactions) {
        setTransactionsByEmployee(transactions)
      }
      else {
        setTransactionsByEmployee(data)
      }

    },
    [fetchWithCache, transactions]
  )

  const invalidateData = useCallback(() => {
    if (transactionsByEmployee) {
      setTransactions(transactionsByEmployee)
    }
    setTransactionsByEmployee(null)
  }, [transactionsByEmployee])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}

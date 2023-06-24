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
      if (transactions && data) {
        let newData = transactions.concat(data.filter(transaction => !transactions.some(stored => stored.id === transaction.id)))
        setTransactionsByEmployee(newData.filter(transaction => transaction.employee.id === employeeId))
      }
      else {
        setTransactionsByEmployee(data)
      }

    },
    [fetchWithCache, transactions]
  )

  const invalidateData = useCallback(() => {
    if (transactionsByEmployee && !transactions) {
      setTransactions(transactionsByEmployee)
    } else if (transactionsByEmployee && transactions) {
      setTransactions([...transactions, ...transactionsByEmployee.filter(transaction => !transactions.some(stored => stored.id === transaction.id))])
    }
    setTransactionsByEmployee(null)
  }, [transactionsByEmployee, transactions])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}

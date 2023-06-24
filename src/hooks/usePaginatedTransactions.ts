import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)
  const [transactions, setTransactions] = useState<PaginatedResponse<Transaction[]>>()

  const fetchAll = useCallback(async () => {
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
    )

    setPaginatedTransactions((previousResponse) => {
      if (response === null || (previousResponse === null && !transactions)) {
        return response
      }

      if (transactions) {
        return { data: transactions.data, nextPage: transactions.nextPage }
      }
      else {
        return { data: response.data, nextPage: response.nextPage }
      }
    })
  }, [fetchWithCache, paginatedTransactions, transactions])

  const invalidateData = useCallback(() => {
    if (paginatedTransactions) {
      setTransactions(paginatedTransactions)
    }
    setPaginatedTransactions(null)
  }, [paginatedTransactions])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}

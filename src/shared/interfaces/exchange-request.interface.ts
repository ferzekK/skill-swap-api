export type ExchangeRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface ExchangeRequest {
  id: string;
  requesterId: string;
  responderId: string;
  skillOfferedId: string;
  skillWantedId: string;
  status: ExchangeRequestStatus;
}

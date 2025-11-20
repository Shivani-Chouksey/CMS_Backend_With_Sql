Todo --->

1. Add AWS S3 for file storage
2. Add Redis
3. Add pagination  - ✅
   



✅ Notification Types


company_request
→ When a user expresses interest in buying/selling and creates a request.


chat_started
→ When someone accepts the request and initiates a chat.


chat_message
→ When a new message is sent in an active chat room.


chat_rejected
→ When a user rejects the chat offer.


request_closed
→ When the request is completed or manually closed.


request_expired
→ When the request expires due to time limit.


deal_completed
→ When the transaction is successfully completed.


system_alert
→ For system-level notifications (e.g., maintenance, updates).


portfolio_update
→ When a company in the user’s portfolio has a major update (optional).


price_alert
→ If you plan to notify users about price changes (optional).
   




=====================
server 
1.company request flow
                        companyId, message , buyerid
user → select company -------------------------------------> 1. req create with status active  2. find user from userportfolio model  who have same company  3.save details inside notification > send notification   to all find user  -  emit socket event (company_request_notification) if user conntected 

2. Request accept flow 

                [notificaiton_id, req_id,note_accept_status]
client emit event (accept_chat)-----------------> 




======================
client Side 
company request accept flow 
1. see all company request list based on portfolio company.
2. on socket event for company req , show comapany .

---> emit event (accept_chat) with notification_id , note_accept_status


==========



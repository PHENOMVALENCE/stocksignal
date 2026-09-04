# Hackathon Demo

## Reproducible scenario

Create or seed this clearly labeled demo item:

- Material: Cotton Fabric
- Current quantity: 50 metres
- Reorder level: 15 metres

Record consumption of 40 metres. The expected balance is `50 - 40 = 10`; because `10 <= 15`, the UI shows:

```text
Cotton Fabric
Available: 10 metres
Status: LOW STOCK
```

Expected manager SMS:

```text
STOCKSIGNAL ALERT

Cotton Fabric is running low.

Available: 10 metres
Minimum level: 15 metres.

Restocking is recommended.
```

Demonstrate that another below-threshold movement does not send a duplicate. Replenish above 15 to reset the alert, then cross below it again to prove a new alert is allowed.

Finally choose **Request Restock**, enter 50 metres and the demo supplier, send the supplier SMS, and show the recorded notification. Sandbox phone numbers and credentials must be configured before the live demo.

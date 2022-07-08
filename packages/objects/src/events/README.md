# Channel Events

Channel Events are persistent and durable events. They WILL be processed by all registered recieving services, even if those services are offline when the event is emitted. These events will be delivered to listeners.

We use Moleculer Channels for this purpose. https://www.npmjs.com/package/@moleculer/channels.

One major difference between Events and Channel Events is that Events carry the complete context with them, and can be easily
traced. Channel Events only carry the user context with them.
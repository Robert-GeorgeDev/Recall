At Octom we treat data security as an integral part of how we design and run the service.

We apply technical and organizational measures meant to protect accounts, data and Octom's infrastructure against unauthorized access, loss, alteration or unauthorized disclosure.

No online service can guarantee absolute security. For that reason this page describes the main measures we use, without being a guarantee that the service will be free of vulnerabilities or security incidents.

## 1. Data isolation

Octom is designed so that workspace data is logically separated.

Access to data is controlled through authorization mechanisms and rules applied at the database level, so that a user can access only the data they have permission for.

For workspace-based features, the user's membership of the workspace is checked before access to its data is allowed.

These mechanisms aim to reduce the risk of a user accidentally or deliberately accessing data that belongs to another workspace.

## 2. Encrypted connections

Communications between the user's browser and Octom's infrastructure are sent over secure **HTTPS/TLS** connections.

This helps protect data in transit between the user's device and Octom's services.

Connections to the external providers Octom uses are also made through secure mechanisms provided by those providers, where available and applicable.

## 3. Authentication and sessions

User authentication and the handling of login credentials are provided through **Supabase Authentication** infrastructure.

Octom does not have access to a user's password in readable form.

Access to the account is based on authentication and session mechanisms provided by the authentication infrastructure.

Authentication sessions are used to determine whether a user is logged in before they access protected features.

We recommend that you:

* use a password that is unique to Octom;
* do not share your login details with others;
* log out of devices you do not control;
* contact us if you suspect unauthorized access to your account.

## 4. Access control

Octom uses access controls to limit access to data and features.

Depending on the user's role and membership, access may be limited to certain workspaces and features.

Operations that can have important effects on the account or data do not rely only on the interface visible in the browser.

Where applicable, authorization is also checked on the server before the operation is carried out.

## 5. Server and API checks

Operations carried out through the API and operations that affect data are subject to appropriate authorization checks.

These checks are especially important for operations such as:

* changing data;
* deleting data;
* deleting the account;
* managing the subscription;
* AI features;
* administrative operations;
* other actions that may affect data or the account.

We do not consider the browser interface to be a sufficient authorization mechanism.

Permissions are checked on the server side where the operation and the architecture of the service require it.

## 6. Abuse protection

We apply technical limits to certain features to reduce the risk of abuse, excessive automation and unauthorized use.

These mechanisms may include limiting the number of requests and other technical controls.

In particular, some public or sensitive features, such as the AI assistant and public forms, may have usage limits.

Limits may be adjusted as the service evolves and as security risks are identified.

If we identify misuse, we may temporarily limit access to certain features or to the account, in accordance with the Terms and conditions.

## 7. Payments

Payments for paid plans are processed through **Stripe**.

Full card details are entered and processed through Stripe's infrastructure and are not stored in Octom's database.

Octom receives and stores only the information needed to administer the subscription and keep payment records, in accordance with the Privacy policy.

For more information about how payments are processed, see the **Billing, cancellation and refunds** policy.

## 8. Backup and availability

Octom's data is hosted using the infrastructure of our service providers.

Depending on the infrastructure and configuration used, backup copies may be made to recover data in the event of technical incidents.

Backups are not an alternative to security controls and do not completely remove the risk of data loss.

Backup copies may be kept for a different period than active data, in accordance with the providers' policies and the technical configuration of the service.

## 9. Incident handling

We monitor the service and the infrastructure as far as needed to identify and investigate technical and security problems.

If we identify a security incident involving personal data, we will assess the situation and take the measures required by applicable law.

Where the GDPR or other applicable rules require an authority to be notified or affected users to be informed, we will make the notifications within the periods and under the conditions set by law.

We may take measures such as:

* temporarily limiting access;
* isolating affected components;
* revoking compromised sessions or credentials;
* investigating the cause of the incident;
* fixing the vulnerability;
* restoring the service;
* implementing additional preventive measures.

## 10. Reporting vulnerabilities

If you discover a possible security vulnerability in Octom, please contact us as soon as possible at:

**[contact@octom.eu](mailto:contact@octom.eu)**

You can also use the private vulnerability reporting in the "Security" tab of the [public repository](https://github.com/Robert-GeorgeDev/octom). Contact details are also available in the [security.txt](/.well-known/security.txt) file. Please do not publish the vulnerability before we can fix it.

When you report a vulnerability, it helps to include:

* a description of the problem;
* the steps needed to reproduce it;
* the affected URL or component;
* the impact observed;
* screenshots or technical examples, where relevant;
* any other information that can help us verify the problem.

Please do not access, copy, modify or disclose data that belongs to other users.

Please also do not carry out tests that may affect the availability of the service or other users' data.

When you report a vulnerability in good faith, we recommend that you give us a reasonable period to investigate and fix it before making information about the vulnerability public.

Do not request or use other users' data to demonstrate that a vulnerability exists.

## What we do not promise

Security is an ongoing process and cannot be guaranteed absolutely.

We do not claim that:

* Octom is completely free of vulnerabilities;
* the service will be available at all times;
* no security incident can occur;
* every attack will be detected or prevented;
* data cannot be lost in any circumstances.

Instead, we commit to maintaining and improving the technical and organizational measures used to protect the service and the data.

For information about how personal data is processed, see the **Privacy policy**.

## Contact

For security problems:

**[contact@octom.eu](mailto:contact@octom.eu)**

For problems about personal data, write to us at the same address.

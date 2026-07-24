# Deployment guide — GitHub + Cloudflare Pages + Papaki

Do not change DNS, nameservers or email-related records until the final site and a preview deployment have been approved.

## 1. Create a private GitHub repository

1. Sign in to GitHub and choose **New repository**.
2. Use a name such as `euzoia-website`.
3. Select **Private**.
4. Do not add a README, `.gitignore` or license because they already exist locally.
5. In this project folder, initialize Git, add the GitHub remote, commit and push the `main` branch:

   ```bash
   git init
   git add .
   git commit -m "Initial EUZOIA website"
   git branch -M main
   git remote add origin https://github.com/OWNER/euzoia-website.git
   git push -u origin main
   ```

Replace `OWNER` with the GitHub account or organization name. Never commit credentials.

## 2. Connect Cloudflare Pages

1. In Cloudflare Dashboard, go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Authorize only the private `euzoia-website` repository when possible.
3. Select the repository and the `main` production branch.
4. Use these build settings:
   - Framework preset: **None**
   - Build command: leave empty
   - Build output directory: `/` (repository root)
   - Root directory: leave empty
   - Environment variables: none
5. Save and deploy. Every later push to `main` will create a production build; pull requests and non-production branches can create preview builds.

## 3. Preview before production

1. Create a branch such as `preview/site-review`.
2. Push it to GitHub.
3. Open the generated `*.pages.dev` preview URL from the Cloudflare deployment list.
4. Review desktop and mobile before merging into `main`.
5. Keep the custom domain disconnected until written approval.

## 4. Connect `euzoia.com` after approval

Cloudflare Pages custom domains work most simply when Cloudflare manages the domain's authoritative DNS. Before any change:

1. Export or screenshot the entire existing Papaki DNS zone.
2. Record every `A`, `AAAA`, `CNAME`, `MX`, `TXT`, SRV and CAA entry.
3. Pay special attention to all mail-related records: MX, SPF, DKIM, DMARC, mail/autodiscover hostnames and verification TXT records.
4. In the Pages project, open **Custom domains** → **Set up a custom domain** and add `euzoia.com`.
5. Add `www.euzoia.com` as a second custom domain.

Cloudflare will show the exact DNS records or nameservers required. Do not guess values: copy only the values shown for this Pages project.

### If changing nameservers at Papaki

1. Add the domain to Cloudflare and import the existing DNS zone.
2. Compare the imported zone line-by-line with the Papaki export.
3. Recreate any missing record before changing nameservers.
4. Keep mail records **DNS only** (grey cloud), never proxied.
5. At Papaki, replace only the authoritative nameservers with the two nameservers assigned by Cloudflare.
6. Do not delete the Papaki zone until DNS and email have been verified.

### If keeping Papaki DNS

Use the exact CNAME or verification records shown by Cloudflare Pages. Apex-domain CNAME support depends on the DNS provider. If Papaki cannot flatten an apex CNAME, use Cloudflare authoritative DNS instead. Do not replace any unrelated record.

## 5. Preserve email

Before and after the DNS change, confirm that all of these remain identical:

- MX priorities and destinations
- SPF TXT record
- every DKIM selector and value
- `_dmarc` record
- mail, webmail and autodiscover records
- provider verification records

Test incoming and outgoing email immediately after DNS activation. DNS propagation can take up to the TTL previously configured.

## 6. HTTPS and canonical redirect

1. In Cloudflare SSL/TLS, use **Full (strict)** whenever the origin configuration supports it. Pages provides an edge certificate automatically.
2. Wait until both custom domains show **Active** and their certificates are issued.
3. Verify `https://euzoia.com`.
4. This project includes `_redirects` to send `www.euzoia.com` permanently to `euzoia.com`.
5. Confirm the redirect with both HTTP and HTTPS. Do not enable `includeSubDomains` or HSTS preload until every subdomain is known to support HTTPS; the project currently applies HSTS only to the requested hostname.

## 7. Automatic publishing

- A push or merge to `main` publishes the production branch automatically.
- Other branches create isolated preview deployments.
- Cloudflare Pages requires no server runtime or package installation for this project.

## 8. Rollback

1. Open **Workers & Pages** → the EUZOIA project → **Deployments**.
2. Find the last known-good production deployment.
3. Choose **Rollback to this deployment** or **Promote to production**, depending on the current Cloudflare interface.
4. Alternatively, revert the problematic Git commit and push the revert to `main`.
5. Verify the homepage, video, redirects and HTTPS after rollback.

## Final launch checklist

- Written approval for copy, visual design and preview URL
- Full Papaki DNS export stored safely
- Mail records compared before any nameserver change
- Both custom domains active with HTTPS
- `www` → apex redirect verified
- Forms, tracking or cookies added only after separate approval

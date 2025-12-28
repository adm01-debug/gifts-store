export class APMService {{
  track(metric: string, value: number) {{
    console.log(`[APM] ${{metric}}: ${{value}}`);
  }}

  startTransaction(name: string) {{
    const start = Date.now();
    return {{
      end: () => {{
        this.track(name, Date.now() - start);
      }}
    }};
  }}
}}

export const apm = new APMService();

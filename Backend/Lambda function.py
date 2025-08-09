import boto3
import requests
from datetime import datetime

def lambda_handler(event, context):
    query = """
    SELECT 
        eventType,
        page,
        COUNT(*) AS total_events,
        COUNT(DISTINCT sessionId) AS unique_sessions,
        toDate(timestamp) AS day
    FROM events
    WHERE eventType IN ('page_view', 'click')
    GROUP BY eventType, page, day
    ORDER BY day, eventType, page
    FORMAT CSV
    """

    clickhouse_url = "http://a6b6ef657a8b54b40bdb19ced69bab4a-249521892.us-east-1.elb.amazonaws.com:8123/"

    try:
        response = requests.get(
            clickhouse_url,
            params={"query": query},
            auth=("admin", "secret")
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": f"Failed to query ClickHouse: {str(e)}"}

    # Build CSV ensuring no extra lines
    rows = response.text.strip()
    header = "eventType,page,total_events,unique_sessions,day"
    csv_data = f"{header}\n{rows}"

    # Filename
    timestamp = datetime.utcnow().isoformat().replace(":", "-").split(".")[0]
    filename = f"clickhouse-exports/click_summary_{timestamp}.csv"

    try:
        s3 = boto3.client("s3")
        s3.put_object(
            Bucket="lugx-analytics-data-pasindu-2025",
            Key=filename,
            Body=csv_data.encode("utf-8"),
            ContentType="text/csv"
        )
    except Exception as e:
        return {"status": "error", "message": f"Failed to upload to S3: {str(e)}"}

    return {"status": "success", "message": f"Data uploaded to S3 as {filename}"}

import argparse
import csv
import json
from pathlib import Path
from typing import Dict, List


def _normalize_delimiter(delimiter: str) -> str:
    return "\t" if delimiter == "\\t" else delimiter


def tsv_to_json_file(
    tsv_path: str,
    json_path: str,
    encoding: str = "utf-8",
    delimiter: str = "\t",
) -> None:
    """Convert a TSV file to a JSON array file.

    The first line in the TSV must contain header names.
    Each subsequent line becomes a JSON object in the output array.
    """
    tsv_path = Path(tsv_path)
    json_path = Path(json_path)
    delimiter = _normalize_delimiter(delimiter)

    with tsv_path.open("r", encoding=encoding, newline="") as tsv_file:
        reader = csv.DictReader(tsv_file, delimiter=delimiter)
        if reader.fieldnames is None:
            raise ValueError(f"No header row found in TSV file: {tsv_path}")
        records: List[Dict[str, str]] = [row for row in reader]

    json_path.parent.mkdir(parents=True, exist_ok=True)
    with json_path.open("w", encoding=encoding, newline="\n") as json_file:
        json.dump(records, json_file, indent=2, ensure_ascii=False)
        json_file.write("\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert a TSV file to JSON.")
    parser.add_argument("tsv_file", help="Input TSV file path")
    parser.add_argument("json_file", nargs="?", help="Output JSON file path")
    parser.add_argument(
        "--delimiter",
        default="\t",
        help="Delimiter used by the input file (default: tab). Use '\\t' for a literal tab.",
    )
    parser.add_argument(
        "--encoding",
        default="utf-8",
        help="File encoding for input and output (default: utf-8).",
    )
    args = parser.parse_args()

    output_path = args.json_file or f"{Path(args.tsv_file).stem}.json"
    tsv_to_json_file(args.tsv_file, output_path, encoding=args.encoding, delimiter=args.delimiter)


if __name__ == "__main__":
    main()

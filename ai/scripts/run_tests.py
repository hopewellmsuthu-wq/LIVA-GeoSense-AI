"""
LIVA GeoSense AI
Phase 1A - Test Runner

Runs the complete Phase 1 AI engine test suite.
"""

from pathlib import Path
import subprocess
import sys


PROJECT_ROOT = Path(__file__).resolve().parent.parent

TEST_FILE = (
    PROJECT_ROOT
    / "ai"
    / "engine"
    / "tests"
    / "test_engine.py"
)


def main():

    print("=" * 60)
    print("        LIVA GEOSENSE AI TEST RUNNER")
    print("=" * 60)

    print()
    print(f"Project: {PROJECT_ROOT}")
    print(f"Test file: {TEST_FILE}")
    print()

    if not TEST_FILE.exists():

        print("ERROR: Test file was not found.")

        sys.exit(1)

    print("Running Phase 1 AI engine tests...")
    print()

    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "unittest",
            "discover",
            "-s",
            str(TEST_FILE.parent),
            "-p",
            "test_*.py"
        ],
        cwd=PROJECT_ROOT
    )

    print()

    if result.returncode == 0:

        print("=" * 60)
        print("ALL TESTS PASSED")
        print("=" * 60)

    else:

        print("=" * 60)
        print("TESTS FAILED")
        print("=" * 60)

    sys.exit(result.returncode)


if __name__ == "__main__":
    main()

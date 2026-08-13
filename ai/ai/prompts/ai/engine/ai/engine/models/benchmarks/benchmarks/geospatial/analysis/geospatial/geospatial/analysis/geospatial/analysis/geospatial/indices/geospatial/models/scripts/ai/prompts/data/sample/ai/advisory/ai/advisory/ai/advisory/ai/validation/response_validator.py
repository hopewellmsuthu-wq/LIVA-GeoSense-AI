"""
LIVA GeoSense
AI Response Validator

Validates AI-generated agricultural advice against
the GeoSense evidence.

This is a rule-based MVP validator. It does not replace
human or scientific review.
"""

import re
from typing import Dict, Any, List


class ResponseValidator:
    """
    Validates an AI response against supplied GeoSense data.
    """

    def __init__(self, context: Dict[str, Any]):
        self.context = context

    def validate(self, response: str) -> Dict[str, Any]:
        """
        Validate an AI-generated response.
        """

        if not response or not response.strip():
            return self._failure(
                "AI response is empty."
            )

        issues: List[str] = []

        issues.extend(
            self._check_for_fabricated_values(response)
        )

        issues.extend(
            self._check_for_unsupported_diagnosis(response)
        )

        issues.extend(
            self._check_uncertainty(response)
        )

        issues.extend(
            self._check_field_verification(response)
        )

        passed = len(issues) == 0

        return {
            "passed": passed,
            "status": (
                "VALID"
                if passed
                else "REVIEW_REQUIRED"
            ),
            "issues": issues,
            "response": response
        }

    # -----------------------------------------------------
    # FABRICATED VALUES
    # -----------------------------------------------------

    def _check_for_fabricated_values(
        self,
        response: str
    ) -> List[str]:

        issues = []

        observed = (
            self.context
            .get("observed_data", {})
        )

        known_values = []

        for key in [
            "current_ndvi",
            "previous_ndvi",
            "rainfall_mm",
            "soil_moisture"
        ]:

            value = observed.get(key)

            if isinstance(value, (int, float)):
                known_values.append(
                    str(value)
                )

        numbers = re.findall(
            r"(?<![\w.])-?\d+(?:\.\d+)?",
            response
        )

        suspicious = []

        for number in numbers:

            if number not in known_values:
                suspicious.append(number)

        if suspicious:

            issues.append(
                "Response contains numerical values "
                "not found in the supplied evidence: "
                + ", ".join(suspicious)
            )

        return issues

    # -----------------------------------------------------
    # UNSUPPORTED DIAGNOSIS
    # -----------------------------------------------------

    def _check_for_unsupported_diagnosis(
        self,
        response: str
    ) -> List[str]:

        issues = []

        response_lower = response.lower()

        high_risk_terms = [
            "definitely has",
            "confirmed disease",
            "confirmed pest",
            "definitely drought",
            "certainly drought",
            "diagnosed with",
            "guaranteed",
            "100% certain"
        ]

        for term in high_risk_terms:

            if term in response_lower:

                issues.append(
                    "Potentially unsupported certainty: "
                    f"'{term}'"
                )

        return issues

    # -----------------------------------------------------
    # UNCERTAINTY
    # -----------------------------------------------------

    def _check_uncertainty(
        self,
        response: str
    ) -> List[str]:

        issues = []

        response_lower = response.lower()

        uncertainty_terms = [
            "may",
            "might",
            "could",
            "possible",
            "potential",
            "suggests",
            "cannot determine"
        ]

        has_uncertainty = any(
            term in response_lower
            for term in uncertainty_terms
        )

        if not has_uncertainty:

            issues.append(
                "Response does not clearly communicate "
                "uncertainty."
            )

        return issues

    # -----------------------------------------------------
    # FIELD VERIFICATION
    # -----------------------------------------------------

    def _check_field_verification(
        self,
        response: str
    ) -> List[str]:

        issues = []

        risk = (
            self.context
            .get("risk_assessment", {})
        )

        risk_level = risk.get(
            "level",
            "UNKNOWN"
        )

        response_lower = response.lower()

        verification_terms = [
            "field",
            "inspect",
            "inspection",
            "verify",
            "verification",
            "farmer",
            "agronomist"
        ]

        has_verification = any(
            term in response_lower
            for term in verification_terms
        )

        if (
            risk_level in [
                "MODERATE",
                "HIGH"
            ]
            and not has_verification
        ):

            issues.append(
                "Moderate or high risk requires "
                "field verification guidance."
            )

        return issues

    # -----------------------------------------------------
    # FAILURE HELPER
    # -----------------------------------------------------

    @staticmethod
    def _failure(
        message: str
    ) -> Dict[str, Any]:

        return {
            "passed": False,
            "status": "REVIEW_REQUIRED",
            "issues": [message],
            "response": None
      }

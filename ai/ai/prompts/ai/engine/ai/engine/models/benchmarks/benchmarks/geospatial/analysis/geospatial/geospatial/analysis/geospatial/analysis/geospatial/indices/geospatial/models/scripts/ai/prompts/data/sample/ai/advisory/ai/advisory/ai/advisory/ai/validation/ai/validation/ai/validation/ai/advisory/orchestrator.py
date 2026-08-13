"""
LIVA GeoSense
AI Advisory Orchestrator

Coordinates the complete advisory workflow:

    GeoSense Report
          ↓
      AI Context
          ↓
    Farmer Question
          ↓
    Advisory Prompt
          ↓
      AI Response
          ↓
   Response Validator
          ↓
   Final Advisory Result

The local AI model is intentionally injected into this
class so that the system remains model-agnostic.
"""

from typing import Dict, Any, Callable

from ai.context.geosense_context import (
    build_ai_context
)

from ai.advisory.engine import (
    AdvisoryEngine
)

from ai.validation.response_validator import (
    ResponseValidator
)


class GeoSenseOrchestrator:
    """
    Main orchestration layer for LIVA GeoSense AI.
    """

    def __init__(
        self,
        model_function: Callable[
            [str],
            str
        ]
    ):
        """
        Parameters
        ----------
        model_function:
            Function that accepts an AI prompt and returns
            a generated response.

        Later this function will call the local GGUF model.
        """

        if not callable(model_function):

            raise TypeError(
                "model_function must be callable."
            )

        self.model_function = model_function

        self.advisory_engine = (
            AdvisoryEngine()
        )

    # -----------------------------------------------------
    # RUN COMPLETE ADVISORY
    # -----------------------------------------------------

    def run(
        self,
        geosense_report: Dict[str, Any],
        farmer_question: str
    ) -> Dict[str, Any]:
        """
        Run the complete GeoSense advisory workflow.
        """

        if not geosense_report:

            raise ValueError(
                "GeoSense report cannot be empty."
            )
            

        if not farmer_question:

            raise ValueError(
                "Farmer question cannot be empty."
            )

        # -------------------------------------------------
        # STEP 1 — BUILD AI CONTEXT
        # -------------------------------------------------

        context = build_ai_context(
            geosense_report
        )
        evidence_engine = EvidenceEngine(
    context
)

evidence = evidence_engine.generate()
"evidence": evidence,

        # -------------------------------------------------
        # STEP 2 — BUILD ADVISORY REQUEST
        # -------------------------------------------------

        request = (
            self.advisory_engine.create_request(
                context=context,
                farmer_question=farmer_question
            )
        )

        prompt = request["prompt"]

        # -------------------------------------------------
        # STEP 3 — CALL AI MODEL
        # -------------------------------------------------

        response = self.model_function(
            prompt
        )

        # -------------------------------------------------
        # STEP 4 — VALIDATE RESPONSE
        # -------------------------------------------------

        validator = ResponseValidator(
            context
        )

        validation = validator.validate(
            response
        )

        # -------------------------------------------------
        # STEP 5 — RETURN COMPLETE RESULT
        # -------------------------------------------------

        return {

            "system":
                "LIVA GeoSense",

            "question":
                farmer_question,

            "ai_response":
                response,

            "validation":
                validation,

            "context":
                context,

            "status":
                (
                    "READY"
                    if validation["passed"]
                    else "REVIEW_REQUIRED"
                )
}

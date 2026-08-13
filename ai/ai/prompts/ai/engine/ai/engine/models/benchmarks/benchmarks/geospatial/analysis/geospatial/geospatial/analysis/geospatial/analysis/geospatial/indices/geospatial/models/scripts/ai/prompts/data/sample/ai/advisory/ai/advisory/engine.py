"""
LIVA GeoSense
AI Advisory Engine

Connects:
    GeoSense Context
          +
    Farmer Question
          ↓
    Advisory Prompt

The generated prompt can later be sent directly
to the local GGUF model.
"""

from typing import Dict, Any

from ai.prompts.advisory_prompt import (
    build_advisory_prompt
)


class AdvisoryEngine:
    """
    LIVA GeoSense agricultural advisory engine.
    """

    def __init__(
        self,
        system_name: str = "LIVA GeoSense"
    ):
        self.system_name = system_name

    def create_prompt(
        self,
        context: Dict[str, Any],
        farmer_question: str
    ) -> str:
        """
        Create an AI-ready agricultural advisory prompt.
        """

        if not isinstance(context, dict):

            raise TypeError(
                "GeoSense context must be a dictionary."
            )

        if not farmer_question:

            raise ValueError(
                "Farmer question cannot be empty."
            )

        return build_advisory_prompt(
            context=context,
            farmer_question=farmer_question
        )

    def create_request(
        self,
        context: Dict[str, Any],
        farmer_question: str
    ) -> Dict[str, Any]:
        """
        Create a complete advisory request.

        This structure can later be passed to the
        local AI inference engine.
        """

        prompt = self.create_prompt(
            context=context,
            farmer_question=farmer_question
        )

        return {
            "system": self.system_name,

            "request_type":
                "agricultural_advisory",

            "question":
                farmer_question,

            "prompt":
                prompt,

            "offline":
                True,

            "requires_field_verification":
                True
}

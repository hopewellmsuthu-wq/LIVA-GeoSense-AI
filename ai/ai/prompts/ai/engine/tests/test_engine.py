"""
LIVA GeoSense AI Engine Tests

Phase 1 tests for:
- Runtime configuration
- System prompt loading
- User input validation
- Prompt construction
- Engine status
"""

import unittest

from main import (
    load_config,
    load_system_prompt,
    validate_input,
    build_prompt,
    get_engine_status
)


class TestLivaGeoSenseEngine(unittest.TestCase):

    # -----------------------------------------------------
    # CONFIGURATION TEST
    # -----------------------------------------------------

    def test_configuration_loads(self):
        """Runtime configuration should load successfully."""

        config = load_config()

        self.assertIsInstance(config, dict)
        self.assertIn("application", config)
        self.assertIn("model", config)
        self.assertIn("hardware", config)
        self.assertIn("privacy", config)

    # -----------------------------------------------------
    # SYSTEM PROMPT TEST
    # -----------------------------------------------------

    def test_system_prompt_loads(self):
        """The LIVA GeoSense system prompt should exist."""

        prompt = load_system_prompt()

        self.assertIsInstance(prompt, str)
        self.assertGreater(len(prompt), 100)

        self.assertIn("LIVA GeoSense AI", prompt)
        self.assertIn("offline", prompt.lower())

    # -----------------------------------------------------
    # INPUT VALIDATION
    # -----------------------------------------------------

    def test_valid_input(self):
        """Normal user questions should be accepted."""

        valid, result = validate_input(
            "How can I monitor crop health?"
        )

        self.assertTrue(valid)
        self.assertEqual(
            result,
            "How can I monitor crop health?"
        )

    def test_empty_input(self):
        """Empty questions should be rejected."""

        valid, message = validate_input("")

        self.assertFalse(valid)
        self.assertIn("question", message.lower())

    def test_whitespace_input(self):
        """Whitespace-only input should be rejected."""

        valid, message = validate_input("     ")

        self.assertFalse(valid)

    def test_none_input(self):
        """Missing input should be rejected."""

        valid, message = validate_input(None)

        self.assertFalse(valid)

    def test_input_too_long(self):
        """Inputs above the maximum length should be rejected."""

        long_input = "A" * 4001

        valid, message = validate_input(long_input)

        self.assertFalse(valid)
        self.assertIn("4000", message)

    # -----------------------------------------------------
    # PROMPT BUILDER
    # -----------------------------------------------------

    def test_prompt_builder(self):
        """The final prompt should contain system instructions
        and the user query.
        """

        system_prompt = "You are LIVA GeoSense AI."

        user_question = "What is vegetation health?"

        prompt = build_prompt(
            system_prompt,
            user_question
        )

        self.assertIn(
            "You are LIVA GeoSense AI.",
            prompt
        )

        self.assertIn(
            "What is vegetation health?",
            prompt
        )

        self.assertIn(
            "USER QUERY:",
            prompt
        )

    # -----------------------------------------------------
    # ENGINE STATUS
    # -----------------------------------------------------

    def test_engine_status(self):
        """Engine status should expose important configuration."""

        config = load_config()

        status = get_engine_status(config)

        self.assertEqual(
            status["application"],
            "LIVA GeoSense AI"
        )

        self.assertEqual(
            status["mode"],
            "offline"
        )

        self.assertEqual(
            status["runtime"],
            "llama.cpp"
        )

        self.assertEqual(
            status["model_format"],
            "GGUF"
        )

        self.assertTrue(
            status["offline_only"]
        )

        self.assertFalse(
            status["external_ai_api"]
        )


# ---------------------------------------------------------
# TEST RUNNER
# ---------------------------------------------------------

if __name__ == "__main__":
    unittest.main()

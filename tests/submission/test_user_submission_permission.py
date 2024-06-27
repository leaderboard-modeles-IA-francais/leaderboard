import unittest
from unittest.mock import patch
from datetime import datetime, timedelta, timezone

from src.submission.check_validity import user_submission_permission
from src.envs import RATE_LIMIT_PERIOD, RATE_LIMIT_QUOTA

class TestUserSubmissionPermission(unittest.TestCase):

    def setUp(self):
        self.user_name = "test_user"
        self.rate_limit_period = RATE_LIMIT_PERIOD
        self.rate_limit_quota = RATE_LIMIT_QUOTA
        self.fixed_now = datetime(2023, 6, 1, 12, 0, 0, tzinfo=timezone.utc)
        # Submission dates that simulate various test cases
        self.users_to_submission_dates = {
            "test_user": [
                (self.fixed_now - timedelta(days=1)).isoformat(),
                (self.fixed_now - timedelta(days=2)).isoformat(),
                (self.fixed_now - timedelta(days=3)).isoformat(),
                (self.fixed_now - timedelta(days=4)).isoformat(),
            ]
        }

    @staticmethod
    def fixed_datetime_now(tz=None):
        return datetime(2023, 6, 1, 12, 0, 0, tzinfo=timezone.utc)

    @patch('src.submission.check_validity.datetime')
    def test_user_below_quota(self, mock_datetime):
        mock_datetime.now.side_effect = self.fixed_datetime_now
        mock_datetime.fromisoformat = datetime.fromisoformat
        allowed, message = user_submission_permission(
            self.user_name, self.users_to_submission_dates, self.rate_limit_period, self.rate_limit_quota
        )
        self.assertTrue(allowed)

    @patch('src.submission.check_validity.datetime')
    def test_user_at_quota(self, mock_datetime):
        mock_datetime.now.side_effect = self.fixed_datetime_now
        mock_datetime.fromisoformat = datetime.fromisoformat
        
        # Add one more submission to reach the quota
        self.users_to_submission_dates["test_user"].append(self.fixed_now.isoformat())
        
        allowed, message = user_submission_permission(
            self.user_name, self.users_to_submission_dates, self.rate_limit_period, self.rate_limit_quota
        )
        self.assertFalse(allowed)
        expected_message = (
            f"Organisation or user `{self.user_name}` already has {self.rate_limit_quota} model requests submitted "
            f"in the last {self.rate_limit_period} days.\n"
            "Please wait a couple of days before resubmitting, so that everybody can enjoy using the leaderboard 🤗"
        )
        self.assertEqual(message, expected_message)

    @patch('src.submission.check_validity.datetime')
    def test_user_above_quota(self, mock_datetime):
        mock_datetime.now.side_effect = self.fixed_datetime_now
        mock_datetime.fromisoformat = datetime.fromisoformat
        # Add more than quota submissions
        for _ in range(self.rate_limit_quota + 1):
            self.users_to_submission_dates["test_user"].append(self.fixed_now.isoformat())
        allowed, message = user_submission_permission(
            self.user_name, self.users_to_submission_dates, self.rate_limit_period, self.rate_limit_quota
        )
        self.assertFalse(allowed)

    def test_user_no_previous_submissions(self):
        allowed, message = user_submission_permission(
            "new_user", self.users_to_submission_dates, self.rate_limit_period, self.rate_limit_quota
        )
        self.assertTrue(allowed)

    @patch('src.submission.check_validity.HAS_HIGHER_RATE_LIMIT', ["specific_user"])
    @patch('src.submission.check_validity.datetime')
    def test_user_higher_rate_limit(self, mock_datetime):
        mock_datetime.now.side_effect = self.fixed_datetime_now
        mock_datetime.fromisoformat = datetime.fromisoformat
        self.users_to_submission_dates["specific_user"] = [self.fixed_now.isoformat()] * (self.rate_limit_quota + 1)
        allowed, message = user_submission_permission(
            "specific_user", self.users_to_submission_dates, self.rate_limit_period, self.rate_limit_quota
        )
        self.assertTrue(allowed)

    @patch('src.submission.check_validity.datetime')
    def test_submission_just_outside_window(self, mock_datetime):
        mock_datetime.now.side_effect = self.fixed_datetime_now
        mock_datetime.fromisoformat = datetime.fromisoformat
        old_submission = (self.fixed_now - timedelta(days=self.rate_limit_period, seconds=1)).isoformat()
        self.users_to_submission_dates["test_user"] = [old_submission]
        allowed, message = user_submission_permission(
            self.user_name, self.users_to_submission_dates, self.rate_limit_period, self.rate_limit_quota
        )
        self.assertTrue(allowed)

if __name__ == '__main__':
    unittest.main()
